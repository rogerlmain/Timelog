<?php

	define ("domain_name", "208.73.201.47");

	define ("image_path", "http://" . domain_name . "/timelog/resources/images/bundion.svg");
	define ("image_width", 452);

?>

<html>


<head>

	<title>The Bundion System</title>

	<meta property="og:locale" content="en_US">
	<meta property="og:site_name" content="The Bundion System">
	<meta property="og:type" content="website">
	<meta property="og:title" content="The Bundion System">
	<meta property="og:description" content="The solution to that perennial business question: how long with it take? The answer is The Bundion System.">
	<meta property="og:url" content="http://bundion.com">
	<meta property="og:image" content="http://bundion.com/resources/bundion.placard.png">

	<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9182902529353306" crossorigin="anonymous"></script>

	<style>


		@font-face {
			font-family: Gabriola;
			src: url("http://<?=domain_name?>/timelog/resources/fonts/Gabriola.ttf") format("truetype");
		}/* @font-face */


		:root {
			--serious-font: Verdana, Tahoma, sans-serif;
			--fun-font: Gabriola;
		}/* :root */



		/********/


		* { 
			font-family: var(--fun-font);
			font-size: 16pt;
		}/* * */


		*.asterisk {
			font-size: 16pt;
			font-weight: normal;
			line-height: 12pt;
		}/* *.asterisk */


		*.bordered, *.bordered > * { border: solid 1px red }
		*.fully-bordered, *.fully-bordered * { border: solid 1px red }

		
		*.spaced-out {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			/* border: solid 1px red; */
		}/* *.spaced-out */


		*.spaced-out * { margin: 0 !important }


		*.spaced-out img { 
			position: relative;
    		left: -0.8em;
		}/* *.spaced-out img */


		*.subtext { 
			font-size: 9pt;
			text-align: right;
		}/* *.subtext */


		/********/


		html, body {
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
		}/* html, body */


		body, div.centered {
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}/* body, div.centered */


		body { background-color: #DBFFEA }


		/********/


		div.header { background-color:  }

		div.header > div:nth-child(2) { text-align: center }
		div.header > div:last-child { text-align: right }

		div.header div.gabriola { font-size: 38pt }
		div.header img { width: <?=image_width?>px }


		div.subheader {
			font-family: var(--serious-font);
			font-size: 14pt;
		}/* div.subheader */

		
		div.column-layout {
			display: flex;
			flex-direction: column;
			max-width: <?=image_width * 2?>px;
			height: 100%;
		}/* div.column-layout */


		img.rexlogo {
			height: 38px;
		}/* div.rexlogo */


		div.copyright-footer * {
			font-family: var(--serious-font);
			font-size: 10pt;
		}/* div.copyright-footer * */


		div.row-layout {
			display: flex;
			flex-direction: row;
			column-gap: 2.5em;
		}/* div.row-layout */


		div.two-piece-form {
			display: grid;
			grid-template-columns: min-content 1fr;
			column-gap: 1em;
			row-gap: 2px;
			white-space: nowrap;
		}/* div.two-piece-form */


		div.two-piece-form input { width: 100% }


		img.bundion { 
			content: url(<?=image_path?>);
			height: 1em; width: auto;
		}/* img.bundion */


		p img.bundion { position: relative; top: 0.2em }


		/********/

		#mc_embed_signup div#mce-responses { 
			float: none !important;
			width: 100%;
			text-align: center;
		}

 		#mc_embed_signup div.response { 
			float: none !important;
			margin: 0 !important; 
			padding: 0 !important;
			width: auto !important;
		}

	</style>

<head>


<body>
	<div class="row-layout">

		<div class="centered">
			<div class="column-layout">

				<div class="centered">
					<div class="header">
						<div class="gabriola">The</div>
						<img src="<?=image_path?>" />
						<div class="gabriola">System</div>
					</div>
				</div>

				<div class="centered subheader">Time is precious. Make every second count.</div>

				<div class="centered">SPRING 2023</div>

				<div class="centered">
					<div class="row-layout" style="column-gap: 0.5em">
						<img class="rexlogo" src="resources/cartoon.circle.png" />
						<div class="centered">
							<div class="column-layout copyright-footer">
								<div>&copy; Copyright 2022 - Roger L. Main (DBA RMPC)</div>
								<div>All rights reserved</div>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>

		<div>

			<div style="width: 600px">
				<p>
					In 1888, during the Industrial Revolution, a simple idea changed the way people do business.
				</p>

				<p>
					Now, 140 years later, that same idea is set to do it again with The <img class="bundion" /> System.
				</p>
					
				<p>	
					The <img class="bundion" /> System addresses that perennial business question: how long will it take?
				</p>
			</div>

			<div class="mailchimp">

				<!-- Begin Mailchimp Signup Form -->

				<link href="//cdn-images.mailchimp.com/embedcode/classic-071822.css" rel="stylesheet" type="text/css">

				<style type="text/css">
					#mc_embed_signup{background:#fff; clear:left; font:14px Helvetica,Arial,sans-serif;  width:600px;}
				</style>

				<div id="mc_embed_signup"  style="border: solid 1px black">
					<form action="https://rexthestrange.us11.list-manage.com/subscribe/post?u=87a9501b5bb50c93faa07f09f&amp;id=97a435a4e3&amp;f_id=00bdb7e0f0" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
						<div id="mc_embed_signup_scroll">

							<h2>Get updates sent directly to your email</h2>

							<div class="subtext"><span class="asterisk">*</span> Required field</div></div>

							<div class="two-piece-form">

								<label for="mce-EMAIL">Email Address <span class="asterisk">*</span></label>
								<div>
									<input type="email" value="" name="EMAIL" class="required email" id="mce-EMAIL" required>
									<span id="mce-EMAIL-HELPERTEXT" class="helper_text"></span>
								</div>

								<label for="mce-FNAME">First Name </label>
								<span>
									<input type="text" value="" name="FNAME" class="" id="mce-FNAME">
									<span id="mce-FNAME-HELPERTEXT" class="helper_text"></span>
								</span>

								<label for="mce-LNAME">Last Name </label>
								<span>
									<input type="text" value="" name="LNAME" class="" id="mce-LNAME">
									<span id="mce-LNAME-HELPERTEXT" class="helper_text"></span>
								</span>

							</div>

							<div class="centered">
								<div class="two-piece-form" style="margin-top: 1em">

									<label for="mce-MMERGE5" style="text-align: right">I'd like to be a beta tester</label>
									<input type="checkbox" name="MMERGE5" class="" id="mce-MMERGE5" value="Yes" />

									<span id="mce-MMERGE5-HELPERTEXT" class="helper_text" style="grid-column: 1/-1"></span>

									<label for="mce-MMERGE6" style="text-align: right">I'm interested in investing </label>
									<input type="checkbox" name="MMERGE6" class="" id="mce-MMERGE6" value="Yes" />

									<span id="mce-MMERGE6-HELPERTEXT" class="helper_text" style="grid-column: 1/-1"></span>
									
								</div>
							</div>

							<div id="mce-responses" class="centered" style="display: block">
								<div class="response" id="mce-error-response" style="display:none"></div>
								<div class="response" id="mce-success-response" style="display:none"></div>
							</div>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->

							<div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_87a9501b5bb50c93faa07f09f_97a435a4e3" tabindex="-1" value=""></div>

							<div class="spaced-out">
								<a href="http://eepurl.com/h_gyxX" title="Mailchimp - email marketing made easy and fun"><img src="https://eep.io/mc-cdn-images/template_images/branding_logo_text_dark_dtp.svg"></a>
								<input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button">
							</div>

						</div>
					</form>
				</div>

				<script type='text/javascript' src='//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js'></script>
				<script type='text/javascript'>(function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';fnames[3]='ADDRESS';ftypes[3]='address';fnames[4]='PHONE';ftypes[4]='phone';fnames[5]='BIRTHDAY';ftypes[5]='birthday';}(jQuery));var $mcj = jQuery.noConflict(true);</script>

				<!--End mc_embed_signup-->

			</div>

		</div>

	</div>
</body>


</html>




