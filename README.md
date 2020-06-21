# Dengue-Stop

Dengue-Stop provides a simple and effective way to report and discover dengue incidents around your area, with the help of community.

# Installation

This instructions consist of 3 sections for Community Flutter App, Flask Backend and React Admin Panel respectively. Make sure to follow the initial setup before following each sections.

## Initial Setup

Clone the repository
`git clone https://github.com/scorelab/DengueStop.git`

## Flutter Community App

1. Install Flutter  
   Follow the official [guide](https://flutter.dev/docs/get-started/install) from the flutter team.

2. Run `flutter doctor`

   ```
   flutter doctor
   ```

   If all are ok, jump-in to the next step.

3. Go to the `dengue_app` folder

   ```
   cd dengue_app/
   ```

4. Install all the dependent flutter packages.  
   Run `flutter pub get` in the terminal, or click **Packages get** in IntelliJ or Android Studio.

   ```
   flutter pub get
   ```

5. Run the application.

   ```
   flutter run
   ```

## Flask Backend

1. Install Python3

2. Go to `backend` folder

   ```
   cd backend/
   ```

3. If you're running the backend for the first time, run the `init.sh` script to install the required dependencies from the `requirements.txt` file. If not, skip to the 3rd step.

   ```
   sh init.sh
   ```

4. Start the flask server by running the `start.sh` script. This will run the `app.py` file. Flask server will run at `http://127.0.0.1:5000` by default.
   ```
   sh start.sh
   ```

### Database Migration

Once you have configured the connection between the flask server and the database, you could simply run `init.sh` to run flask-migrate schema migrations to create the tables and the relations according to the SQLAlchemy classes created in each python file in `models/` directory.

Or, If you wish to run just the schema migrations, follow the following steps.

1. Go to `backend` folder

## Flask Backend

1. Go to `backend` folder

   ```
   cd backend/
   ```

2. Start the virtualenv

   ```
   . venv/Scripts/activate
   ```

3. Commit changes to the database

   ```
   flask db migrate
   ```

4. Push the changes to the database
   ```
   flask db upgrade
   ```

Once the database is created, you can use the endpoint `/pre_populate_database` if you wish populate the database with any required data to start off with the application. MAKE SURE TO REMOVE it after you are done with the prepopulations.

## React Admin Panel

To be completed

# License

This project is licensed under the terms of the Apache License 2.0.
