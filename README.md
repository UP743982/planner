Week Planner Web App

Application is written in HTML/CSS and JS using MongoDB as a choice of database. Front-End is written using BootStrap framework therefore design works on diffrent screen sizes.


*** INSTALLATION ***

1. Initialise mongoDB
2. npm install
3. node app

application is running on port 8080

*** HOW IT WORKS ***

Application consist of three parts: week pagination, table and dashboard.

Week pagination presents 24 weeks separating one table per week. User have option to jump between weeks (no particular order) to see, edit or delete content of each weeks.

Table is re-presentation of data inserted in the dashboard below. Table have 6 sections: type, leader, topics, notes, assessment, resources.
To select particular row of the table simply click on the row.
For future improvements: make rows sortable with drag and drop enabling option to prioritise tasks.

Dashboard enables user to populate tables with data.
If any of the input fields are left empty system will notify user no to leave inputs empty.
Below the dashboard there are three buttons: add, edit, remove.

Fill all input fields in the dashboard and click "Add". Inserts row in the table. Notification about new row appears in the right corner of the screen.

To "Edit" or "Remove" user have to select row in the table. Rows change color indicating selected row. Once clicked on the row, content transfers back to the dashboard. 

Make any changes and click "Edit". Table content changes and notification about changes appear in the right corner of the screen.

Select particular row in the table and click "Remove". Row is removed from the table. Notification about deleted row will appear in the right corner of the screen.