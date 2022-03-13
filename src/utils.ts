import * as fs from 'fs'

export function writeArrayIntoFile (file: string, array: string[]): void {
  const data: string = array.join('\n')
  fs.writeFileSync(file, data, 'utf8')
}

export function readTextIntoArray (file: string): string[] {
  const data: string = fs.readFileSync(file).toString('utf-8')
  return data.split('\n')
}

export function grToNum (gr: string): number {
  gr = gr.replace(/\s+/g, '')
  var newStr: string = ''
  var numsFlag = false
  for (var i: number = 0; i < gr.length; i++) {
    const code = gr.charCodeAt(i)
    if (code < 48 || code > 57) {
      if (numsFlag) break
    } else {
      numsFlag = true
      newStr += String.fromCharCode(code)
    }
  }
  return parseInt(newStr)
}
