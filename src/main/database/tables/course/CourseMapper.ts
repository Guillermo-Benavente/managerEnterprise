import CourseData from "Types/main/database/CourseData";
import CourseType from "Types/main/database/CourseType";

export default class CourseMapper {
  static toData(c: CourseType): CourseData {
    return {
      id:       c.id,
      name:     c.name,
      employee: c.employee,
      url:      c.url,
    };
  }

  static toFrontend(data: CourseData): CourseType {
    return {
      id:       data.id,
      name:     data.name,
      employee: data.employee,
      url:      data.url,
    };
  }
}