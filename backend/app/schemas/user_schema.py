from pydantic import BaseModel, EmailStr, ConfigDict


class CreateUser(BaseModel):
    name: str
    email: EmailStr
    password: str

class CreateUserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: EmailStr