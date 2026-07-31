import fs from 'fs/promises'
import { PDFParse } from 'pdf-parse'


/**
 * Extract text from PDF file
 * @params {string} filePath-path to pdf file
 * @returns {Promise<{text:String,numPages:number}>}
 */

export const extractTextFromPdf=async(filePath)=>{
    try {
        const dataBuffer=await fs.readFile(filePath)

        //Pdf parser expects a Uint8Array, not a buffer
        const parser=new PDFParse(new Uint8Array(dataBuffer))
        const data=await parser.getText()

        return {
            text:data.text,
            numPages:data.numPages,
            info:data.info
        }
    } catch (error) {
        console.error("PDF Parsing error",error)
        throw new Error("Failed to extract text from PDF")
    }
}