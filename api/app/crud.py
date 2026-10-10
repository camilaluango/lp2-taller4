from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload

from app.models import Lote, Perfume


def listar_lotes(db: Session, perfume_id: int | None = None) -> list[Lote]:
    consulta = select(Lote).options(joinedload(Lote.perfume)).order_by(Lote.id)
    if perfume_id is not None:
        consulta = consulta.where(Lote.perfume_id == perfume_id)
    return list(db.scalars(consulta).all())


def obtener_lote(db: Session, lote_id: int) -> Lote | None:
    consulta = select(Lote).options(joinedload(Lote.perfume)).where(Lote.id == lote_id)
    return db.scalar(consulta)


def listar_perfumes(db: Session) -> list[Perfume]:
    return list(db.scalars(select(Perfume).order_by(Perfume.id)).all())
