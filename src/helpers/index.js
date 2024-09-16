import React, { Fragment } from "react";
import { Link } from "react-router-dom";

function timeSince( date ) {

    var seconds = Math.floor((Date.now() - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

const eventLogMapper = {
  SEND_TOKENS: eventItem => {
    const { docId: id, details, dateCreated } = eventItem;
    const hours = details.amount;
    const description = details.description || "";
    const toLink = <Link to={`/user/${details.to.id}`}>{details.to.name}</Link>;
    const fromLink = (
      <Link to={`/user/${details.from.id}`}>{details.from.name}</Link>
    );
    return {
      id,
      summary: (
        <Fragment>
          {toLink} recieved {hours} hours from {fromLink}
        </Fragment>
      ),
      date: timeSince(dateCreated),
      extra: description
    };
  },
  APPROVE_TOKENS: eventItem => {
    const { docId: id, details, dateCreated } = eventItem;
    const hours = details.tokens;
    const meals = details.meals;
    const description = details.description;
    const userPhoto = details.requesterPhoto || null;
    const orgPhoto = details.fromPhoto || null;
    const photo = details.photo || null;
    const contributorLink = (
      <Link to={`/user/${details.requesterId}`}>{details.requesterName}</Link>
    );
    const organisationLink = (
      <Link to={`/organisation/${details.fromId}`}>{details.fromName}</Link>
    );
    return {
      id,
      photo,
      userPhoto,
      orgPhoto,
      summary: (
        <Fragment>
          { contributorLink } helped { hours } people
          { meals ? ` and provided ${meals} meals ` : '' }
          { " " }
          with { organisationLink }
          { " " }
          (Approved)
        </Fragment>
      ),
      date: timeSince(dateCreated),
      extra: description
    };
  },
  REQUEST_TOKENS: eventItem => {
    const { docId: id, details, dateCreated } = eventItem;
    const hours = details.loggedHours;
    const meals = details.mealsProvided;
    const description = details.description;
    const photo = details.photo;
    const orgPhoto = details.fromOrg.photo;
    const userPhoto = details.requester.photo;
    const contributorLink = (
      <Link to={`/user/${details.requester.id}`}>{details.requester.name}</Link>
    );
    const organisationLink = (
      <Link to={`/organisation/${details.fromOrg.id}`}>
        {details.fromOrg.name}
      </Link>
    );
    return {
      id,
      photo,
      orgPhoto,
      userPhoto,
      summary: (
        <Fragment>
          { contributorLink } helped { hours } people
          { meals ? ` and provided ${ meals } meals ` : '' }
          { " " }
          with { organisationLink }
          { " " }
          (Pending approval)
        </Fragment>
      ),
      date: timeSince(dateCreated),
      extra: description
    };
  }
};

const getImageSize = ( image, size ) => {
  if ( !image ) {
    return null;
  }

  const sizes = {
    square_sm: '200x200',
    square_md: '400x400',
    letter_md: '600x400',
    letter_lg: '1200x800',
  }

  const sizeString = sizes[ size ] || sizes.letter_lg;

  return image.replace( /(\.(jpe?g|png|gif|tiff|bmp))/, `_${ sizeString }$1` );
}

export {
  timeSince,
  eventLogMapper,
  getImageSize,
}
