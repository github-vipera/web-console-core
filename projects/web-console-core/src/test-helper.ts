import { Observable } from "rxjs";

/*
export function failLogin(testName:string, error:any) {
    let text:string = "Test " + testName + " failed login: " + error.message;
    console.log(text);
    fail(text);
}
*/

export function failLogin(error: any) {
    let text: string = "Test login failed: " + error.message;
    console.log(text);
    fail(text);
}

export function failTestWithMessage(testName: string, message: string) {
    let text: string = "Test " + testName + " failed: " + message;
    console.log(text);
    fail(text);
}

export function failTestWithError(testName: string, error: any) {
    let text: string = "Test " + testName + " failed: " + error.message;
    console.log(text);
    fail(text);
}

export function b64toFile(b64Data: string, filename: string, sliceSize: number): File {
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    var file = new File(byteArrays, filename);
    return file;
}

export function blobToB64(blob: Blob): Promise<any> {
    return new Promise((resolve, reject) => {
        let reader: FileReader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(blob);
    });
}