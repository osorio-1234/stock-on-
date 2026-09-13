"""Hash y verificación de contraseñas con PBKDF2."""

import hashlib
import hmac
import secrets

ITERACIONES = 120000


def crear_hash(password: str) -> str:
    salt = secrets.token_bytes(16)
    clave = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERACIONES)
    return f"{salt.hex()}:{clave.hex()}"


def comprobar_password(password: str, password_hash: str) -> bool:
    try:
        salt_hex, clave_hex = password_hash.split(":")
        salt = bytes.fromhex(salt_hex)
        clave = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, ITERACIONES)
        return hmac.compare_digest(clave.hex(), clave_hex)
    except ValueError:
        return False
