import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class ValidateEmptyPipe implements PipeTransform {
  constructor(private message?: string) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      if (
        value === null ||
        value === undefined ||
        (typeof value === 'object' && Object.keys(value).length === 0)
      ) {
        throw new BadRequestException(
          this.message ?? 'Body cannot be an empty object',
        );
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
