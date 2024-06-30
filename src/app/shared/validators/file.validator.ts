export class FileValidator {
  // allowedExtensions: ['.xlsx', '.TXT', '.pdF'] o ['xlsx', 'TXT', 'pdF']
  static isAllowedFile(filename: string, allowedExtensions: string[]): boolean {
    return new RegExp(
      `\\.(${allowedExtensions.join('|').replaceAll('.', '')})$`,
      'i'
    ).test(filename);
  }

  static getExtension = (
    filename: string | null | undefined
  ): string | undefined => filename?.split('.').pop()?.toLowerCase();
}
