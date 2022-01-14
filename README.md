# statki-IO
**Jak włączyć aplikację**

1. Tworzymy wirtualne środowisko 
  ```
  python -m venv .\venv
  ```
2. Aktywujemy venv korzzystając z odpowiedniego skryptu 
  ```
  .\venv\Scripts\activate
  ```
3. Instalujemy wymagane pakiety:
  ```
  pip install -r requirements.txt
  ```
4. Ustawiamy zmienną środowiskową (korzystam z Windowsa w przypadku Linuxa trzeba użyć innej komendy):
  ```
  set FLASK_APP=app
  ```
5. Inicjalizujemy bazę danych
  ```
  flask db init
  flask db migrate
  flask db upgrade
  ```
6. Tworzymy profile botów uruchamiając skrypt *createBots.py*
7. Włączamy serwer
  ```
  flask run
  ```
