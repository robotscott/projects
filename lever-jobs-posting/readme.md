# Lever Jobs Posting

- JIRA Ticket: https://jira.bancvue.com/browse/FSP-126
- Code Dependencies: jQuery 2.+
- Framework: Built in Classic CMS, but should work on either
- Working Example: https://scottwedellkcms.fipreview.com/careers.html

## Implementation 

All function realated to the Lever API are contained within the jobListing object.

The page building functions append all content to an element with the id "careers". The page on which these functions are being called must have an element with that id.

The jobListing object contains six variables for controlling career page output.

- companyName: Should be set the to FI's Lever username
- initialOrder: Defines the listing page's initial sorting order. Options are AtoZ, ZtoA, newest, or oldest
- userSortOptions: Set to true to add sort option dropdown for user
- filterOptions: Add filtering categories as a string with multiple categories seperated by commas. Options include location, commitment, team, and/or department. Leaving as undifined will omit filtering options.
- onDetailsPageLoad: Optional callback for after details page has loaded
- onListPageLoad: Optional callback for after list page has loaded

Options will be set within a sites document ready function, after wich the function jobListing.callListings() will be called.

Example:
$f(document).ready(function() {
	if ($f('#careers').length) {
		jobListing.companyName = 'kasasa';
        jobListing.userSortOptions = true;
        jobListing.filterOptions = 'team, location, commitment, department';
        jobListing.callListings();
    }
});

The example provided above contains a few minimal styles for page structure, but there are two key styles that are important to the functionality of the list page filters.

1. If a filter has been selected in the filter section it will recieve the class "acitve". It is important that filters with this class be differiciated in some way, or the user will not be able to tell what filters are turned on. (Example turns all active filters green.)
2. When the job list is being filtered it will be given the class "filtered" and jobs matching the selected filters will be given the class "match". All jobs in the filtered list that do not have the class "match" hidden or made to appear disabled in some way. (e.g. .jobs-list.filtered .job:not(.match) { display: none; })

Any restructuring of the output content can be handled by assinging a function to either jobListing.onDetailsPageLoad or jobListing.onListPageLoad.