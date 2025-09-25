import { Router, type Request, type Response } from "express";

const router = Router();


router.get("/", (req: Request, res: Response) => {
  const myInfo = {
    success: true,
    message: "Student Information",
    data: {
      studentId: "670610724", 
      firstName: "Melissa",      
      lastName: "Tiangtae",       
      program: "CPE",         
      section: "001"           
    }
  };
  
  return res.status(200).json(myInfo);
});

export default router;