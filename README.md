Python Assignment  --  

There is one script that we have to run.

First,
1. clone the git repo.
2. cd Python task
3. Set up the virtual environment
4. Activate.
5. install the necessary modules using - pip install -r requirements,txt
6. run the python script using - python3 -m advanced_python_script
7. the script will automatically take the "data.csv" as a dataset and make salary and contact columns encrypted and also decrypted. Then it run Trend Analysis and Outlier Detection on the encrypted dataset.
8. We have a testing python file as test_script.py that run unit tests using - python3 -m unittest test_script 


Express Js Assignment -- 

to setup the project you need to do the following steps
1. go to Express task directory
2. open the mongoDB compass application because I used mongodb as database. Just open mongoDB compass and start the local server at 27017 port.
3. open the terminal and use "nodemon" command if installed or simply type "node app.js".
4. To check the real time web socket server go to "http://localhost:3000/index.html" which is publicly served.
5. the  profile pictures are also can be seen in the web browser through url paths.
6. If you need my default data then I have already created backup, you just have to run the command
mongorestore --uri="mongodb://localhost:27017" --drop "Express task/test_express"
