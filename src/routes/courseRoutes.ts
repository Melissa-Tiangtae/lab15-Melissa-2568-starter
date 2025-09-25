import { Router, type Request, type Response } from "express";
import { zStudentId } from "../schemas/studentValidator.js";
import { zCourseId, zCoursePostBody, zCoursePutBody, zCourseDeleteBody } from "../schemas/courseValidator.js"
import { type Student, type Course } from "../libs/types.js";
import { students, courses } from "../db/db.js";

const router: Router = Router();


const handleError = (res: Response, err: unknown) => {
    return res.status(500).json({
        success: false,
        message: "Somthing is wrong, please try again",
        error: err,
    });
};




router.get("/students", (req: Request, res: Response) => {
    try {
      
        return res.status(200).json({
            success: true,
            data: students.map((student) => student),
        });
    } catch (err) {
        return handleError(res, err);
    }
});


router.get("/courses", (req: Request, res: Response) => {
    try {
      
        return res.status(200).json({
            success: true,
            data: courses.map((course) => course),
        });
    } catch (err) {
        return handleError(res, err);
    }
});



router.get("/students/:studentId/courses", (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const result = zStudentId.safeParse(studentId);

        if (!result.success) {
        
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        const student = students.find(s => s.studentId === studentId);
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student does not exists", 
            });
        }

        const resultCourses = student.courses?.map(courseId => {
            const course = courses.find(c => c.courseId === courseId);
            return {
                courseId: course?.courseId,
                courseTitle: course?.courseTitle
            };
        }) || [];

        res.set("Link", `/students/${studentId}/courses`);

        return res.status(200).json({
            success: true,
            message: `Get courses detail of student ${studentId}`,
            data: {
                studentId,
                courses: resultCourses,
            }
        });
    } catch (err) {
        return handleError(res, err);
    }
});



router.get("/courses/:courseId", (req: Request, res: Response) => {
    try {
        const { courseId } = req.params;
        const courseIdNum = Number(courseId);
        const result = zCourseId.safeParse(courseIdNum);

        if (!result.success) {
            let errorMessage = result.error.issues[0]?.message;
            if (isNaN(courseIdNum)) {
                errorMessage = "Invalid input: expected number, received NaN";
            }
            return res.status(400).json({
                message: "Validation failed",
                errors: errorMessage, 
            });
        }

        const course = courses.find(c => c.courseId === courseIdNum);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course does not exists", 
            });
        }

        res.set("Link", `/courses/${courseId}`);

        return res.status(200).json({
            success: true,
            message: `Get course ${courseId} successfully`,
            data: {
                courseId: courseIdNum,
                courseTitle: course.courseTitle,
                instructors: course.instructors,
            }
        });
    } catch (err) {
        return handleError(res, err);
    }
});


// POST
router.post("/courses", (req: Request, res: Response) => {
    try {
        const body = req.body as Course;
        const result = zCoursePostBody.safeParse(body);

        if (!result.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        const existingCourse = courses.find(c => c.courseId === body.courseId);
        if (existingCourse) {
            return res.status(409).json({
                success: false,
                message: "Course Id is already exists", 
            });
        }

        courses.push(body);
        res.set("Link", `/courses/${body.courseId}`);

        return res.status(200).json({ 
            success: true,
            message: `Course ${body.courseId} has been added successfully`,
            data: body,
        });
    } catch (err) {
        return handleError(res, err);
    }
});



router.put("/courses", (req: Request, res: Response) => {
    try {
        const body = req.body;
        const result = zCoursePutBody.safeParse(body);

        if (!result.success) {
            return res.status(400).json({
                success: false, 
                message: "Validation failed",
                errors: result.error.issues[0]?.message,
            });
        }

        const courseIndex = courses.findIndex(c => c.courseId === body.courseId);
        if (courseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course Id does not exists", 
            });
        }

        courses[courseIndex] = { ...courses[courseIndex], ...body };
        res.set("Link", `/courses/${body.courseId}`);

        return res.status(200).json({
            success: true,
            message: `course ${body.courseId} has been updated successfully`,
            data: courses[courseIndex],
        });
    } catch (err) {
        return handleError(res, err);
    }
});


// DELETE
router.delete("/courses", (req: Request, res: Response) => {
    try {
        const body = req.body;
        const result = zCourseDeleteBody.safeParse(body);

        if (!result.success) {
        
            return res.status(400).json({
                success: false, 
                message: "Validation failed",
                error: result.error.issues[0]?.message, 
            });
        }

        const courseIndex = courses.findIndex(c => c.courseId === body.courseId);
        if (courseIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Course Id does not exists", 
            });
        }

        const deletedCourse = courses.splice(courseIndex, 1)[0];

        return res.status(200).json({
            success: true,
            message: `Course ${deletedCourse?.courseId} has been deleted successfully`,
            data: deletedCourse,
        });
    } catch (err) {
        return handleError(res, err);
    }
});

export default router;