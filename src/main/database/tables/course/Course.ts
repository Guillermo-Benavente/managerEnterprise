import CourseData from 'Types/database/CourseData';
import CourseType from 'Types/database/CourseType';
import CourseMapper from './CourseMapper';

export default class Course {

  constructor(private data: CourseData) {
    if (!data.id)                         throw new Error('El ID del curso es obligatorio');
    if (!data.name)                       throw new Error('El nombre del curso es obligatorio');
    if (!data.employee)                   throw new Error('El DNI del empleado es obligatorio');
    if (!data.url)                        throw new Error('La URL es obligatoria');
  }

  /** UI → dominio */
  static fromView(c: CourseType): Course {
    if (!c.id)         throw new Error('El ID del curso es obligatorio');
    if (!c.name)       throw new Error('El nombre del curso es obligatorio');
    if (!c.employee)   throw new Error('El DNI del empleado es obligatorio');
    if (!c.url)        throw new Error('La URL es obligatoria');

    return new Course(CourseMapper.toData(c));
  }

  /** dominio → BD plano */
  toData(): CourseData {
    return this.data;
  }

  /** dominio → UI */
  toFrontend(): CourseType {
    return CourseMapper.toFrontend(this.data);
  }
}