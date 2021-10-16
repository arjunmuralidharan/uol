# Test Gradez
Remember to reset the database prior to the tests

## View default page 
* Open default app webpage

## Sign in to the app with Slack
* Open default app webpage
* Click button "Sign in with Slack"
* Enter workspace and continue
* Enter Slack email and password and continue
* Click button "Allow"
* Open default app webpage
* Validate user is logged in

 ## View personal grades page
 * Open default app webpage
 * Click "My Grades"
 
 ## Try to add invalid grades to Graphics Programming in October 2021 and verify they were not accepted
 * Open default app webpage
 * Click "Add Grade"
 * Select "Module" "CM2030"
 * Select "Session" "October 2021"
 * Click button "Next Step"
 * Enter a grade of "28"
 * Check for "Grade must be between 40 and 100"
 * Enter a grade of "-7"
 * Check for "Grade must be between 40 and 100"
 * Enter a grade of "107"
 * Check for "Grade must be between 40 and 100"
 * Click button "Next Step"
 * Check for "Sorry, looks like there are some errors"
 * Click button "Ok, got it"
 
 ## Try to add grade that was already entered and verify that module is not available in list
 * Open default app webpage
 * Click "Add Grade"
 * Select "Module" "CM2030"
 * Select "Session" "October 2021"
 * Click button "Next Step"
 * Enter a grade of "90"
 * Click button "Next Step"
 * Check for "Review Your Grade Information"
 * Click button "Submit     "
 * Check for "All is good! Please confirm the grade submission"
 * Click button "Yes"
 * Verify that module "CM2030" is not available anymore
 
 ## Edit Existing Grade Entered In Previous Step
 * Open default app webpage
 * Click "My Grades"
 * Click edit for "CM2030"
 * Select "Session" "April 2020"
 * Enter a grade of "75"
 * Click button "Save Changes"
 * Check for "All is good! Please confirm the grade changes"
 * Click button "Yes"
 * Validate personal grade in "CM2030" "Agile Software Projects" in "April 2020" with grade "75"

## Confirm tied grades are sorted by timestamp
This relies on the database having two users with the same grade and different timestamps.
Please refer to db to know which user should come before the other.
* Open default app webpage
* Click link "CM3070"
* "Alice" is above "Bob"

## Verify user avatar exists in navbar
* Open default app webpage
* Check for user avatar on navbar

## Verify user avatar exists in leaderboard
* Open default app webpage
* Click link "CM1005"
* Check for user avatar in "CM1005" leaderboard

## Verify Cumulative Grade and Completion Rate are visible
* Open default app webpage
* Click "My Grades"
* Check for "Cumulative Grade"
* Check for "Completion Rate"