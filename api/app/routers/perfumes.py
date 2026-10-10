from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.schemas import PerfumeRead


router = APIRouter(prefix="/perfumes", tags=["perfumes"])


@router.get("/", response_model=list[PerfumeRead])
def listar_perfumes(db: Session = Depends(get_db)) -> list[PerfumeRead]:
    return crud.listar_perfumes(db)
