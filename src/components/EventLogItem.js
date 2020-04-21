import React from 'react';

const SendTokens = props => {

}

const ApproveTokens = props => {

}

const RequestTokens = props => {

}

const EventLogItem = {
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
	  const description = details.description;
	  const contributorLink = (
		<Link to={`/user/${details.requesterId}`}>{details.requesterName}</Link>
	  );
	  const organisationLink = (
		<Link to={`/organisation/${details.fromId}`}>{details.fromName}</Link>
	  );
	  return {
		id,
		summary: (
		  <Fragment>
			{contributorLink} helped {hours} people with {organisationLink}{" "}
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
	  const description = details.description;
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
		summary: (
		  <Fragment>
			{contributorLink} helped {hours} people with {organisationLink}{" "}
			(Pending approval)
		  </Fragment>
		),
		date: timeSince(dateCreated),
		extra: description
	  };
	}
  };
