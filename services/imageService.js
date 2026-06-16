import { db } from '../db/db.js'
import { productImages } from '../db/schema.js'
import { saveFile, getUrl } from '../storage/r2.js'
import { fileTypeFromBuffer } from 'file-type'
import crypto from 'crypto'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const uploadProductImage = async (files, productId) => {
    for(const file of files){
        try{
            const type = await fileTypeFromBuffer(file.buffer)
            if(!type || !ALLOWED_MIME_TYPES.includes(type.mime)){
                continue
            }
            const id = crypto.randomUUID()
            const extension = type.ext
            const filename = `${id}.${extension}`

            await saveFile(file.buffer, filename, type.mime)
            const url = getUrl(filename)

            const [insertImage] = await db.insert(productImages).values({
                id,
                key: filename,
                imageUrl: url,
                productId
            }).returning()

        }catch(error){
            console.log(error)
        }
    }
}