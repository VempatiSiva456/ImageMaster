# Image Master

# Components:

<hr>

## 1. Register Page:

The user has to enter basic details like username, email, password etc. The following Error cases are properly handled. 
- User emails will be unique.
- Basic validation checks are handled.

![register](images/signUp.jpeg)

## 2. Sign-In Page:

The user can sign in as either normal user role or admin role with the registered email address. 

![signIn](images/signIn.jpeg)

## 3. Home Page (Mode Selection Page):

The user after successfully logging in, can choose to join either a public or private channel to annotate images.

![homePage](images/homePage.jpeg)


## 4. Classes Management Page:

- The admin can create new domains. He can create and add new classes under those domains.

![homePage](images/domainPage.jpeg)

- Admins can delete the domains or clases created by him/her.

![homePage](images/domainPage_delete.jpeg)

- User can only annotate with an existing class that has already been created by the admin.

![homePage](images/classesManagement_1.jpeg)
![homePage](images/classesManagement_2.jpeg)

## 5. Public Dashboard:

- The list of all the images with their status (annotated or not) and annotator (the person who annotated the image) is displayed in this page.

![homePage](images/publicDashboard_all.jpeg)

- User can select a filter to view only annotated images or pending images.

![homePage](images/publicDashboard_annotated.jpeg)


- User can search for images by class name.

![homePage](images/publicDashboard_all_search.jpeg)

- User can upload new images into the public dashboard page. Multiple images can be uploaded at once.

![homePage](images/publicDashboard_uploa.jpeg)
![homePage](images/publicDashboard_uploadimages.jpeg)
![homePage](images/publicDashboard_uploadmultiple.jpeg)

- User can edit the status of annotation to the images that are previously annotated by him/her. 
- User will not be able to edit the annotation of the images annotated by another user.
- The information of all the annotated images can be downloaded as a txt file.
- Users can select multiple images at a time to assign a class to all of them.

![homePage](images/pubDash_1.jpeg)
![homePage](images/pubDash_2.jpeg)
![homePage](images/pubDash_3.jpeg)
![homePage](images/pubDash_4.jpeg)
![homePage](images/pubDash_5.jpeg)

## 5. Private Dashboard:

- The list of all the images that are owned by the user are displayed on this page. No user will be able to view the private dashboard of another user.

![homePage](images/priDash_1.jpeg)

- User can select a filter to view only annotated images or pending images.

![homePage](images/priDash_2.jpeg)
![homePage](images/priDash_3.jpeg)

- Users can select multiple images at a time to assign a class to all of them.

![homePage](images/priDash_4.jpeg)

- User can upload new images into the public dashboard page. Multiple images can be uploaded at once.

![homePage](images/priDash_5.jpeg)

# Dockerized The Application:

## Installation:

- 1. Go to Root directory after cloning the repository (ImageMaster)
- 2. Run command `docker compose up --build` in terminal
- 3. Server will run at localhost 5000, minio at 9001 and frontend at 5173
- 4. Then use the application at `http://localhost:5173`.

### Without Docker Installation:

- 1. Clone the repository, install all dependency packages using `npm install` in both client and server folders.
- 2. Run `minio server ./images` to connect to minio client.
- 3. Run server using `nodemon index.js` and run client using `npm start`.

# Dataset Used:

- For image functionality testing purpose, I used CIFAR 10 test images.

# Demo Video:

- See the demo of Application here [Click](https://drive.google.com/file/d/1yMRTkI-QryeJkEmBfiFzh8pM9TVG_-8r/view?usp=drivesdk)