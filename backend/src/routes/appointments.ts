import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  // Данные, которые соответствуют твоему типу Appointment[]
  const mockAppointments = [
    {
      id: "1",
      userId: "user-123",
      specialistId: "spec-456",
      specialist: {
        id: "spec-456",
        name: "Dr. Anna Smith",
        title: "Psychologist",
        bio: "Expert in postpartum recovery",
        avatar: "https://i.pravatar.cc/150?u=anna",
        specialty: "Psychology",
        rating: 4.9,
        price: 5000,
        availability: []
      },
      dateTime: new Date().toISOString(),
      duration: 60,
      status: 'scheduled',
      notes: "First session"
    }
  ];

  // Ответ, который соответствует твоему типу ApiResponse
  res.json({
    success: true,
    data: mockAppointments // Помещаем данные в поле data
  });
});

router.post("/", (req: Request, res: Response) => {
  res.status(201).json({
    success: true,
    message: "Appointment created"
  });
});

export default router;