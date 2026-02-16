import { Router } from "express";
import { validate as isUuid } from "uuid";
import { AppDataSource } from "../data-source";
import { Report, ReportStatus } from "../entity/Report";
import { Category } from "../entity/Category";
import { UpdateHistory } from "../entity/UpdateHistory";

const router = Router();

const reportRepo = AppDataSource.getRepository(Report);
const categoryRepo = AppDataSource.getRepository(Category);
const historyRepo = AppDataSource.getRepository(UpdateHistory);

router.post("/reports", async (req, res) => {
  try {
    const { title, description, categoryId, location, priority, reporterName } =
      req.body;

    if (!title || !description || !categoryId || !location) {
      return res.status(400).json({ error: "Campos obrigatórios faltando" });
    }

    const category = await categoryRepo.findOneBy({ id: categoryId });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    const report = reportRepo.create({
      title,
      description,
      location,
      priority,
      reporterName,
      status: ReportStatus.OPEN,
      category,
    });

    await reportRepo.save(report);

    return res.status(201).json(report);
  } catch {
    return res.status(500).json({ error: "Erro ao criar denúncia" });
  }
});

router.get("/reports", async (req, res) => {
  const { status, priority, page = "1", limit = "10" } = req.query;

  const where: any = {};

  if (status) where.status = status;
  if (priority) where.priority = priority;

  const reports = await reportRepo.find({
    where,
    relations: ["category"],
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    order: { createdAt: "DESC" },
  });

  return res.json(reports);
});

router.get("/reports/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const report = await reportRepo.findOne({
    where: { id },
    relations: ["category", "history"],
  });

  if (!report) {
    return res.status(404).json({ error: "Denúncia não encontrada" });
  }

  return res.json(report);
});

router.patch("/reports/:id/status", async (req, res) => {
  const { id } = req.params;
  const { newStatus, responsible } = req.body;

  if (!Object.values(ReportStatus).includes(newStatus)) {
    return res.status(400).json({ error: "Status inválido" });
  }

  const report = await reportRepo.findOneBy({ id });

  if (!report) {
    return res.status(404).json({ error: "Denúncia não encontrada" });
  }

  report.status = newStatus;
  await reportRepo.save(report);

  const history = historyRepo.create({
    comment: `Status alterado para ${newStatus}`,
    responsible: responsible || "Sistema",
    report,
  });

  await historyRepo.save(history);

  return res.json(report);
});

router.post("/reports/:id/updates", async (req, res) => {
  const { id } = req.params;
  const { comment, responsible } = req.body;

  if (!comment || !responsible) {
    return res
      .status(400)
      .json({ error: "Comentário e responsável são obrigatórios" });
  }

  const report = await reportRepo.findOneBy({ id });

  if (!report) {
    return res.status(404).json({ error: "Denúncia não encontrada" });
  }

  const history = historyRepo.create({
    comment,
    responsible,
    report,
  });

  await historyRepo.save(history);

  return res.status(201).json(history);
});

export default router;
