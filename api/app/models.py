from datetime import date

from sqlalchemy import CheckConstraint, Date, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Perfume(Base):
    __tablename__ = "perfumes"
    __table_args__ = (CheckConstraint("tamano_ml > 0", name="ck_perfumes_tamano_positivo"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    marca: Mapped[str] = mapped_column(String(100), nullable=False)
    tamano_ml: Mapped[int] = mapped_column(Integer, nullable=False)

    lotes: Mapped[list["Lote"]] = relationship(back_populates="perfume")


class Lote(Base):
    __tablename__ = "lotes"
    __table_args__ = (CheckConstraint("unidades_disponibles >= 0", name="ck_lotes_unidades_no_negativas"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    codigo: Mapped[str] = mapped_column(String(60), unique=True, nullable=False, index=True)
    unidades_disponibles: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    fecha_vencimiento: Mapped[date] = mapped_column(Date, nullable=False)
    perfume_id: Mapped[int] = mapped_column(ForeignKey("perfumes.id"), nullable=False, index=True)

    perfume: Mapped[Perfume] = relationship(back_populates="lotes")
