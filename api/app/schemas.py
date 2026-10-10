from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class PerfumeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    marca: str
    tamano_ml: int


class LoteRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    codigo: str
    unidades_disponibles: int = Field(ge=0)
    fecha_vencimiento: date
    perfume_id: int
    perfume: PerfumeRead
