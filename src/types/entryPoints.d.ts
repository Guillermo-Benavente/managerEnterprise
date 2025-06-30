declare const EntryPointsType: {
  readonly NONE: 'none';
  readonly MAIN: 'main_window';
  readonly FORM: 'form';
  readonly FORM_DOCUMENT: 'form_document';
  readonly EMPLOYEES: 'employees';
  readonly EDIT_EMPLOYEE: 'edit_employee';
  readonly COURSES: 'courses';
  readonly VIEW_COURSE: 'view_course';
  readonly COMPANIES: 'companies';
  readonly EDIT_COMPANY: 'edit_company';
  readonly DOCUMENTS: 'documents';
  readonly EDIT_DOCUMENT: 'edit_document';
  readonly PROFILE: 'profile';
};

export default EntryPointsType;

export type EntryPointsType = (typeof EntryPointsType)[keyof typeof EntryPointsType];