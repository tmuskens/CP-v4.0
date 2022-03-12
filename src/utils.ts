import * as fs from 'fs'

export function writeArrayIntoFile (file: string, array: string[]): void {
  const data: string = array.join('\n')
  fs.writeFileSync(file, data, 'utf8')
}

export function readTextIntoArray (file: string): string[] {
  const data: string = fs.readFileSync(file).toString('utf-8')
  return data.split('\n')
}

// export function grToNum (gr: string) {
//   const newStr: string = ''
//   var numsFlag = false
//   for (var i = 0; i < gr.length; i++) {
//     if (numsFlag && (gr.charAt[i])) {
//       break
//     }
//   }
//   return parseInt(newStr)
// }
