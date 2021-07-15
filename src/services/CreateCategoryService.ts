import { getRepository } from "typeorm";
import AppError from "../errors/AppError";
import Category from "../models/Category";


interface Request {
    title: string;
}

class CreateCategoryService {
    public async execute({ title }: Request): Promise<Category> {
        
        const categoryRepository = getRepository(Category);

        const checkCategory = await categoryRepository.findOne({where: {title}});

        if(checkCategory){
            
            return checkCategory;
            
        }

        const category = categoryRepository.create({
            title
        });

        await categoryRepository.save(category);

        return category;
      }
}

export default CreateCategoryService;