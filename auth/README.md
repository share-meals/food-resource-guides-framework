# Keycloak Setup for Ideal Workflow
This is a guide to set up Keycloak for an ideal workflow, which includes regular user accounts that can only be created by an admin, no automatic account creation, social login buttons for users, and users only able to login with their email addresses. Here are the steps to can follow:

## Step 1: Install Keycloak

First, you need to install Keycloak. Follow the instructions provided in the Getting Started guide for Docker at https://www.keycloak.org/getting-started/getting-started-docker.

## Step 2: Enabling Google IDP
Note. For Google or Microsoft IDP, do not use the default idp social login. 

Instead, create a new idp and configure the following: 
- AUTH_URL
- TOKEN_URL
- PROFILE_URL as User Info URL 

[Link to github issue with OIDC solution](https://github.com/keycloak/keycloak/issues/14258)

## Step 3: Disable Automatic User Creation

By default, Keycloak automatically creates a user account for any user who successfully logs in via a social login provider. To disable this automatic user creation, follow the instructions provided in the Keycloak documentation at https://www.keycloak.org/docs/9.0/server_admin/index.html#disabling-automatic-user-creation.

Specifically, follow the instructions in the "Disabling Automatic User Creation" section to disable automatic user creation.

## Step 4: Configure Default Identity Provider

To ensure that users are only presented with social login buttons and are not prompted to enter a username and password, you need to configure the default identity provider to be Google. Follow the instructions provided in the Keycloak documentation at https://www.keycloak.org/docs/latest/server_admin/index.html#default_identity_provider.

Specifically, follow the instructions in the "Configuring the Default Identity Provider" section to configure Google as the default identity provider.

## Step 5: Create Admin and Regular User Accounts

Now that you have configured Keycloak for social login, you need to create admin and regular user accounts. Follow the instructions provided in the Keycloak documentation at https://www.keycloak.org/docs/latest/server_admin/index.html#creating-users.

Specifically, follow the instructions in the "Creating Users" section to create both an admin user account and a regular user account.


## Step 6: Configure the login page

In the Authentication tab, click on the Flows tab and select the Browser flow. Click on the Copy button to make a copy of the flow. Then, click on the new copy of the flow and configure it as follows:

- Delete the Username Password Form form.
- Add an Identity Provider Redirector form after the Browser form.
- Move the Identity Provider Redirector form to the top of the list.
- In the Identity Provider Redirector form settings, select the desired identity provider (e.g. Google).


