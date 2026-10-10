from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import LoteRead


router = APIRouter(prefix="/lotes", tags=["lotes"])


@router.get("/", response_model=list[LoteRead])
def listar_lotes(perfume_id: int | None = None, db: Session = Depends(get_db)) -> list[LoteRead]:
    return crud.listar_lotes(db, perfume_id=perfume_id)


@router.get("/{lote_id}", response_model=LoteRead)
def obtener_lote(lote_id: int, db: Session = Depends(get_db)) -> LoteRead:
    lote = crud.obtener_lote(db, lote_id)
    if lote is None:
        raise HTTPException(status_code=404, detail="No se encontró el lote")
    return lote
