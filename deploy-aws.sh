echo "Kill all the running PM2 actions"
pm2 kill

echo "Jump to app folder"
cd /home/ec2-user/realtut-lms-api

echo "Update app from Git"
git reset --hard
git pull

echo "Install app dependencies"
yarn install

echo "start app"
yarn start
