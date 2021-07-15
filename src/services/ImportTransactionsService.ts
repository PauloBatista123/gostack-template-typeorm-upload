import Transaction from '../models/Transaction';
import fs from 'fs';
import csvParse from 'csv-parse';
import { getCustomRepository, getRepository, In } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface CSVTransaction {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoriesRespository = getRepository(Category);

    const contactsReadStream = fs.createReadStream(filePath);
    const transactions: CSVTransaction[] = [];
    const categories: string[] = [];

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = contactsReadStream.pipe(parsers);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) => cell.trim());

      if(!title ||! type || !value || !category) return;

      categories.push(category);
      transactions.push({title, type, value, category});
    })

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRespository.find({
      where: {
        title: In(categories)
      }
    });

    const existentCategoriesTitle = existentCategories.map(
      (category: Category)  => category.title 
      );

    const addCategorytitle = categories.filter(category => !existentCategoriesTitle.includes(category)).filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRespository.create(
      addCategorytitle.map(title => ({
        title,
      }))
    )

    await categoriesRespository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createdTransactions = transactionRepository.create(
      transactions.map(transaction => ({
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(
            Category => Category.title === transaction.category,
          )
        })),
    );

    await transactionRepository.save(createdTransactions);

    await fs.promises.unlink(filePath);

    return createdTransactions;

  }

}

export default ImportTransactionsService;
