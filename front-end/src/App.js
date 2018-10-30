import React, { Component } from "react";
import {
  Layout,
  Page,
  FooterHelp,
  Card,
  Link,
  Button,
  FormLayout,
  TextField,
  AccountConnection,
  ChoiceList,
  SettingToggle
} from "@shopify/polaris";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        first: "",
        last: "",
        email: "",
        checkboxes: [],
        connected: false
      }
    };
  }

  render() {
    const breadcrumbs = [
      { content: "Sample apps" },
      { content: "Create React App" }
    ];
    const primaryAction = { content: "New product" };
    const secondaryActions = [{ content: "Import", icon: "import" }];

    const choiceListItems = [
      { label: "I accept the Terms of Service", value: "false" },
      { label: "I consent to receiving emails", value: "false2" }
    ];

    return (
      <Page
        title="Polaris"
        breadcrumbs={breadcrumbs}
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
      >
        <Layout>
          <Layout.AnnotatedSection
            title="Style"
            description="Customize the style of your checkout"
          >
            <SettingToggle
              action={{
                content: "Customize Checkout"
              }}
            >
              Upload your store’s logo, change colors and fonts, and more.
            </SettingToggle>
          </Layout.AnnotatedSection>

          {this.renderAccount()}

          <Layout.AnnotatedSection
            title="Form"
            description="A sample form using Polaris components."
          >
            <Card sectioned>
              {this.state.serverResp && (
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    background: "#e8e1e1",
                    borderRadius: "5px",
                    color: "#228b22",
                    fontWeight: "bolder",
                    fontSize: "1.5em",
                    padding: "1em"
                  }}
                >
                  {JSON.stringify(this.state.serverResp, null, 4)}
                </pre>
              )}

              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    value={this.state.form.first}
                    label="First Name"
                    placeholder="Tom"
                    onChange={this.valueUpdater("first")}
                  />
                  <TextField
                    value={this.state.form.last}
                    label="Last Name"
                    placeholder="Ford"
                    onChange={this.valueUpdater("last")}
                  />
                </FormLayout.Group>

                <TextField
                  value={this.state.form.email}
                  label="Email"
                  placeholder="example@email.com"
                  onChange={this.valueUpdater("email")}
                />

                <TextField
                  multiline
                  label="How did you hear about us?"
                  placeholder="Website, ads, email, etc."
                  value={this.state.form.autoGrow}
                  onChange={this.valueUpdater("autoGrow")}
                />

                <ChoiceList
                  allowMultiple
                  choices={choiceListItems}
                  selected={this.state.form.checkboxes}
                  onChange={this.valueUpdater("checkboxes")}
                />

                <Button primary onClick={this.handleSubmit}>
                  Submit
                </Button>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>

          <Layout.Section>
            <FooterHelp>
              For more details on Polaris, visit our{" "}
              <Link url="https://polaris.shopify.com">style guide</Link>.
            </FooterHelp>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  valueUpdater(field) {
    return value =>
      this.setState(s => ({
        ...s,
        form: { ...s.form, [field]: value }
      }));
  }

  toggleConnection() {
    this.setState(({ connected }) => ({ connected: !connected }));
  }

  connectAccountMarkup() {
    return (
      <Layout.AnnotatedSection
        title="Account"
        description="Connect your account to your Shopify store."
      >
        <AccountConnection
          action={{
            content: "Connect",
            onAction: this.toggleConnection.bind(this, this.state)
          }}
          details="No account connected"
          termsOfService={
            <p>
              By clicking Connect, you are accepting Sample’s{" "}
              <Link url="https://polaris.shopify.com">
                Terms and Conditions
              </Link>
              , including a commission rate of 15% on sales.
            </p>
          }
        />
      </Layout.AnnotatedSection>
    );
  }

  disconnectAccountMarkup() {
    return (
      <Layout.AnnotatedSection
        title="Account"
        description="Disconnect your account from your Shopify store."
      >
        <AccountConnection
          connected
          action={{
            content: "Disconnect",
            onAction: this.toggleConnection.bind(this, this.state)
          }}
          accountName="Tom Ford"
          title={<Link url="http://google.com">Tom Ford</Link>}
          details="Account id: d587647ae4"
        />
      </Layout.AnnotatedSection>
    );
  }

  renderAccount() {
    return this.state.form.connected
      ? this.disconnectAccountMarkup()
      : this.connectAccountMarkup();
  }

  handleSubmit = async () => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const body = JSON.stringify(this.state.form);

    const resp = await fetch(`${apiUrl}/form`, {
      method: "POST",
      body,
      mode: "cors",
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      }
    });

    const json = await resp.json();

    this.setState(s => ({ ...s, serverResp: json }));
  };
}

export default App;
