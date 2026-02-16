import { Router } from "express";
import { validate as isUuid } from "uuid";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";

const router = Router();
const categoryRepo = AppDataSource.getRepository(Category);

router.post("/categories", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const category = categoryRepo.create({
      name,
      isActive: true,
    });

    await categoryRepo.save(category);

    return res.status(201).json(category);
  } catch {
    return res.status(500).json({ error: "Erro ao criar categoria" });
  }
});

router.get("/categories", async (req, res) => {
  const { onlyActive } = req.query;

  const where = onlyActive === "true" ? { isActive: true } : {};

  const categories = await categoryRepo.find({ where });

  return res.json(categories);
});

router.get("/categories/:id", async (req, res) => {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "ID inválido" });
  }

  const category = await categoryRepo.findOneBy({ id });

  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  return res.json(category);
});

router.put("/categories/:id", async (req, res) => {
  const { id } = req.params;
  const { name, isActive } = req.body;

  const category = await categoryRepo.findOneBy({ id });

  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  category.name = name ?? category.name;
  category.isActive = isActive ?? category.isActive;

  await categoryRepo.save(category);

  return res.json(category);
});

router.delete("/categories/:id", async (req, res) => {
  const { id } = req.params;

  const category = await categoryRepo.findOneBy({ id });

  if (!category) {
    return res.status(404).json({ error: "Categoria não encontrada" });
  }

  category.isActive = false;
  await categoryRepo.save(category);

  return res.json({ message: "Categoria desativada" });
});

export default router;
