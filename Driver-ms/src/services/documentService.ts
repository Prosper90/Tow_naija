import { DocumentI } from "../utils/interface";
import DocumentRepository from "../repositories/documentRepository";
import ErrorResponse from "../utils/errorResponse";

// const documentRepository = new DocumentRepository();

class DocumentService {
  private static documentRepository: DocumentRepository;


  static setRepository(repo: DocumentRepository) {
    this.documentRepository = repo;
  }

  /**
   *
   * @param id
   * @returns
   */
  static getDocuments = async (id: string): Promise<DocumentI> => {
    try {
      //find the documents by id
      const findDriver = await this.documentRepository.findOneByField({
        driverId: id,
      });
      if (!findDriver) {
        throw  new ErrorResponse("this driver has not provided documents", 401);
      }

      return findDriver;
    } catch (error) {
      throw error;
    }
  };


  static isDocuments = async (id: string): Promise<boolean> => {
    try {
      //find the documents by id
      const findDriver = await this.documentRepository.findOneByField({
        driverId: id,
      });
      if (!findDriver) {
        return false
      }

      return true;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  static submitDocument = async (
    id: string,
    options: Partial<DocumentI>
  ): Promise<DocumentI> => {
    try {
      //check if this user has a document already
      const checkExistingDocument = await this.documentRepository.findOneByField({
        driverId: id,
      });
      
      if (checkExistingDocument && checkExistingDocument.isApproved) {
        throw new ErrorResponse("Documents aleady submitted", 401);
      }
      if (checkExistingDocument && !checkExistingDocument.isApproved) {
        throw new ErrorResponse("Document is still in review", 401);
      }

      //create new document
      const newDoc = await this.documentRepository.create(options);
      return newDoc;
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @param id
   * @param options
   * @returns
   */
  static updateDocument = async (id: string, options: Partial<DocumentI>) => {
    try {
      const docUpdated = await this.documentRepository.update(
        "driverId",
        id,
        options
      );
      if (!docUpdated) throw new ErrorResponse("This driver documents not found", 401);
      return docUpdated;
    } catch (error) {
      throw error;
    }
  };
}

export default DocumentService;
