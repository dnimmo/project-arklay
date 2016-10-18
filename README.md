# project-arklay

Project Arklay is a simple text adventure game that you can play by visiting http://project-arklay.com. This has been very much a spare time project, and work sporadically continues. If you have any thoughts, or find any issues, please feel free to get in touch: dnimmo@gmail.com

Running with Docker:
```
# build the image
docker build -t arklay .

# start the container - this will serve the application
docker run -d -v $(pwd):/opt/project-arklay -p [YOUR_DESIRED_PORT_HERE]:8080 arklay
```
From here you can navigate to 0.0.0.0:[WHATEVER_PORT_YOU_CHOSE_ABOVE] to see the running application.
