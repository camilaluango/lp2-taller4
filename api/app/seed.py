from datetime import date

from sqlalchemy import select

from app.database import Base, SessionLocal, engine
from app.models import Lote, Perfume


def cargar_datos() -> None:
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        perfumes_iniciales = [
            Perfume(nombre="Eau de Parfum Floral", marca="Aroma Sur", tamano_ml=50),
            Perfume(nombre="Eau de Toilette Cítrico", marca="Brisa", tamano_ml=100),
        ]

        for perfume_nuevo in perfumes_iniciales:
            perfume = db.scalar(
                select(Perfume).where(
                    Perfume.nombre == perfume_nuevo.nombre,
                    Perfume.marca == perfume_nuevo.marca,
                )
            )
            if perfume is None:
                db.add(perfume_nuevo)
                db.flush()
                perfume = perfume_nuevo

            lote_existente = db.scalar(
                select(Lote).where(Lote.codigo == f"LOTE-{perfume.marca.upper()}-001")
            )
            if lote_existente is None:
                db.add(
                    Lote(
                        codigo=f"LOTE-{perfume.marca.upper()}-001",
                        unidades_disponibles=24,
                        fecha_vencimiento=date(2028, 12, 31),
                        perfume_id=perfume.id,
                    )
                )

        db.commit()


if __name__ == "__main__":
    cargar_datos()
    print("Datos de ejemplo cargados.")
