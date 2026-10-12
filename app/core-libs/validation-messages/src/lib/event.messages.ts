export const EVENT_MESSAGES = {
  TAG_NOT_FOUND: 'Tag not found',
  TAG_SLUG_EXISTING:
    'Tag with this name or slug already existing. Please, change name',
  INVALID_TAG_SLUG_STRING: 'Slug',
  INVALID_TAG_NAME_STRING: 'Name',
  COLOR_VALIDATION: {
    TYPE: 'Color must be in string format',
    FORMAT: 'Color must be in HEX format (example: #696969)',
    LENGTH: 'Color must contain 7 characters',
  },
} as const;
