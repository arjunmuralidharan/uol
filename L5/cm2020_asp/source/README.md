# Gradez

## Developer Setup Instructions

1.  Navigate to the repository locally and install the node modules:

        npm install

2.  [Create a new MySQL connection](https://dev.mysql.com/doc/workbench/en/wb-mysql-connections-new.html)
3.  Run the setup script(s) in the `db` directory to build the database.
4.  Copy `.envexample`, rename to `.env`, and update with real configuration. 

    The slack client id and secret are available in https://api.slack.com/apps under `Gradez`. If you cannot see this app please ask an existing collaborator to add you. A redirect URL is defined in slack which includes the port so using the default is suggested. Alternatively you can add another redirect link with the desired port at https://api.slack.com/apps/A01KQU40QAH/oauth?.

    The session string is an arbitrary string - anything will work for your local environment but it should be complex for production.

5.  From the local repository, install nodemon if necessary and start the server:

        $ npm install -g nodemon
        $ nodemon

6. Navigate to `localhost:<port>` in your browser, where `<port>` is the port defined in `.env`


## Git Flow

1. Create a new branch

        git -b checkout "my new fancy branch"

2. Make sure you are on the new branch 

3. Make your changes

4. Stage your changes

		git add .

5. Check your status

		git status

6. Commit your changes

		git commit -m "GL-XX Ticket Description"

7. Push your changes

		git push

It might be that you need to set your upstream. Git will tell you the right command to use if this is the case. Just copy-paste that command and proceed.

## PR Review
We will review each pull request to ensure it works and meets the requirements before merging. You can review changes in github using the "Files changed" tab in the pull request.

To review a pull request locally you can use [github desktop, github command line, or fetch the branch to your local repository with git](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/checking-out-pull-requests-locally). To fetch with git you need the ID of the PR and branchname. For example, [this PR](https://github.com/BlairCurrey/uol-agile-group-project/pull/2)'s ID is `2` and the branchname is `modules_with_grades`.
		
		git fetch origin pull/ID/head:BRANCHNAME
		git checkout BRANCHNAME
		
If the code works and meets the requirements you can merge the request. Otherwise ask for the necessary clarification or changes and the PR owner will address them.
