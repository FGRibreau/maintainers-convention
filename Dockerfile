##
# NAME             : fgribreau/maintainers-convention
# VERSION          : latest
# DOCKER-VERSION   : 1.5
# DESCRIPTION      :
# TO_BUILD         : docker build --rm --pull=true --no-cache -t fgribreau/maintainers-convention .
# TO_SHIP          : docker push fgribreau/maintainers-convention
# TO_RUN           : docker run --rm -it fgribreau/maintainers-convention
##

FROM node:6-onbuild

MAINTAINER François-Guillaume Ribreau <docker@fgribreau.com>
