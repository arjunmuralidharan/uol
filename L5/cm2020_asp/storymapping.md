
Scenario: Accessing the home page
Given that there is a URL to access the product
When the user accesses it
Then the user sees the overview of modules with their respective average grades

Scenario: Show the number of submitted grades per module

Scenario: Show a ranked leaderboard for a module
Given that the user has accessed a specific module
When the module page is displayed
Then the user sees a list of submitted grades with the respective user name and grade

Scenario: Sort the leaderboard by rank and submission time
Given that the user is viewing a list of module grades
When the list is display in order
Then the list is sorted by rank, where ties are assigned the same rank
And tied grades are sorted by timestamp of submission in ascending order

Scenario: Display list of personal grades 
Given that the user has submitted at least one grade 
When they view their personal grades list 
They see a list of modules with their submitted grade 

Scenario: User accesses a protected view
Given that the user is not authenticated
When they access a page that is protected (Personal Grades, Submit Grade, Module Page)
Then they are presented with the option to authenticate with Slack

Scenario: Login using Slack
Given that the user is not authenticated
When they login using Slack successfully
Then they are redirected to the page they were originally requesting

Scenario: User submits a grade
Given that the user is authenticated
And they are shown the option to enter a grade
When they enter a grade
Then they are requested to enter the module, the session, the grade received

Scenario: Editing of grades is frozen
Given that the user has submitted a grade
And the user is authenticated
When they attempt to edit the grade more than 6 months after submission
Then they cannot edit the grade
And are informed of the same on the grades submission form

Scenario: User has not submitted any grades yet
Given that the user has not submitted any grades yet 
When they access their personal grades page
Then they are shown a message "No grades submitted" with a CTA to submit a grade

Scenario: User is trying to submit grade for the same module again
Given that the user has already submitted a grade for a module
When they try to submit another grade for the same module
Then they cannot do so because the module does not appear on the list to begin with

Scenario: User edits an already submitted grade
Given that the user has already submitted a grade for a module
When they attempt to edit their grade on the personal grades page
(And the grade is not frozen)
Then the grade is updated

Scenario: Show user avatars in leaderboard 
Given that there are grades submitted
When the user views the list of grades
Then the user sees Avatars for each submitted grade

Scenario: Information & Welcome Message
Given that the user has access the module overview
When they view the page
Then they are presented with some information about the product, and a personalized welcome message ("Hi, Brad")

Scenario: User submits a PDF of their grades transcript
