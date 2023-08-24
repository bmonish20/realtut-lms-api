# RealTuT Api

## Rules for Submitting a Change:

1. Create a Separate Branch for every task.<br>
   Branch name should be in the format "Name-Task" (i.e. John-ProfileUI)
2. Name your pull request in the same format as Branch name.<br>While Creating a Pull Request attach the following in the PR description:
   - Functionalities implemented.
   - Screenshot of the Implemented Section.
   - Link to the respective Trello Card.
3. Do not merge Pull Requests.

---

## Instructions for Running the Repo on Local Machine:

1. Clone the Repository to your system by executing the following command.

   `git clone https://github.com/RealTuT-LMS/realtut-lms-api.git `

2. Make sure you're in the right directory.

   `cd realtut-lms-api`

3. Run the following command to install dependencies.

   `yarn`

4. To run Locally,

   `yarn dev`

---

## To generate Model/Route/Controller/Validation file:

1. Run the following command

   `npm run generate`

2. Enter the name of the model

   `What should it be called? ${Model Name}`

3. Enter if you want basic CRUD operations created
   `Do you want basic CRUD operation created? true`

4. The Model/Route/Controller/Valudation tuple will be created. Don't forget to add the created routes in /route/v1/index.js.
---
