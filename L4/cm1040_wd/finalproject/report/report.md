# Web Development - Large Coursework Report
Coursera Shareable Link: https://hub.coursera-apps.org/connect/sharedbzxspczm

## Introduction
The submitted website models a political news magazine run by a local team of journalists and editors in the Washington, D.C. area in the United States. It highlights the most important current affairs in U.S. Politics. The news magazine offers a paid membership and runs a calendar of local events. The chosen structure reflects includes a main page with featured stories, a blog with regular updates, a membership page for signing up new paid memberships, an events page as well as a means to contact the editorial team.

## Inspiration
Main inspiration for this site were news publications such as the [Washington Post]('www.washingtonpost.com') and [FiveThirtyEight]('www.fivethirtyeight.com). The following elements were especially inspiring:

* Clean, simple design
* Great, responsive UX
* Focus on content and high-quality imagery and illustrations


## Accessibility
The site is made accessible by ensuring a number of features.

* All images included using the `img` tag have an `alt` attribute indicating alternative text. 
* Another accessibility feature is the use of semantic tags such as `nav` and other structural elements such as headers, paragraphs and content dividers that help screen readers interpret text.
* The color scheme used is high-contrast, further improving readability and compatibility with colour manipulation technology, if used.
* As a final point, some form elements were further labeled with `aria` labels to further help interpretation by assistive technology.

## Usability
The usability of the site has been enhanced with the following elements.

* Clear, consistent one-level navigation structure helps users find content easily. This has been implemented with a simple navigation bar at the top of the page which adapts dynamically if more items are added to it.
* Links and buttons are large and mobile-friendly for tapping. These are implemented with a button style that can be applied both to links and buttons to create consistency.
* Calls-to-action are color-coded and are easy to spot on-screen. These are implemented with the appropriate styling as well and used in a semantic fashion.

Furthermore, the content has been developed with a focus on clarity and consistency around the topic.

## Learnings
Among the important learnings of this coursework were:
* The limitations of static web development and how functionality might be expanded given more server-side functionality.
* The complexity of crafting a text-heavy site for readability and legibility, and the importance of fonts in this endeavour.
* The technical interplay of frameworks such as Bootstrap with the self-coded work, and how these can work together to augment the final product.

## What worked well
Using a framework was useful in hitting the ground running, as it provided some general guides to develop the structure of the site. Understanding the frameworks and how they can be best incorporated into a production-level product is a good take-away for future projects. What also worked well was that by keeping the site map structure in mind, and keeping files organized, the overall administrative work involved reduced dramatically, making it easy to focus on the actual product and less on managing links and dependencies, even for a static site where certain elements are repeated for the lack of a server-side templating engine.

## What could be improved
Controlling layout of a website is hard without professional UX design experience. What can be improved is learning and designing a detailed grid up front that pre-determines spacings and layout details. As such, much of the layout work here involved some trial and error to get right, and this can be avoided in a professional setting.

## Resources used
This website relies on the following resources:

* Bootstrap for foundational layout
* Popper.js for some popover functionality
* jQuery for some dynamic alerting and other functionality

### Sources

[1] getbootstrap.com, 'Bootstrap Documentation', 2020. [Online]. Available: https://getbootstrap.com/docs/. [Accessed: 20-Sep-2020].


[2] jQuery, 'jQuery API', 2020. [Online]. Available: https://api.jquery.com.html. [Accessed: 20-Sep-2020].


[3] popperjs.org, 'Popper Tooltip & Popover Positioning Engine', 2020. [Online]. Available: https://popper.js.org. [Accessed: 20-Sep-2020].

[4] CanAdapt WACG Training & Audits, 'Alternate text for background images', 2020. [Online]. Available: https://www.davidmacd.com/blog/alternate-text-for-css-background-images.html. [Accessed: 20-Sep-2020].

[5] Berhanu, Y. & Hibbard, J., 'Get URL Parameters with JavaScript', 2020. [Online]. Available: https://www.sitepoint.com/get-url-parameters-with-javascript/. [Accessed: 20-Sep-2020].

## Appendices
### Site Map
The sitemap for this submission is shown below.
		
		.
		└── Political Junkie
			├── Featured
			│   ├── Jumbotron
			│   └── Secondary Articles
			├── Blog
			│   ├── Latest Updates
			│   ├── About the Blog
			│   └── Archives
			├── Events
			│   └── Upcoming Events
			│       ├── Video Event with Reminder
			│       └── Sign-Up Live Events
			├── Membership
			│   └── Pricing & Sign-Up
			└── Contact
				└── Contact Form with Success Alert

### Wireframes
* [Featured](img/wire_featured.png)
* [Blog](img/wire_blog.png)
* [Events](img/wire_events.png)
* [Membership](img/wire_membership.png)
* [Contact](img/wire_contact.png)

### Mockups

* Featured ([desktop](img/featured.png) | [mobile](img/featured_mobile.png))
* Blog ([desktop](img/blog.png) | [mobile](img/blog_mobile.png))
* Events ([desktop](img/events.png) | [mobile](img/events_mobile.png))
* Membership ([desktop](img/membership.png) | [mobile](img/membership_mobile.png))
* Contact ([desktop](img/contact.png) | [mobile](img/contact_mobile.png))


