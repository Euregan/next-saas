import Link from "@/ui/Link";
import ApiKey from "@/ui/documentation/ApiKey";
import DynamicUrl from "@/ui/documentation/DynamicUrl";
import Page from "@/ui/documentation/Page";
import Section from "@/ui/documentation/Section";

const DocumentationPage = () => (
  <Page>
    <Section title="Getting started">
      <Section title="Creating your API key">
        <p>
          First, you need to create an API key. You can do it from your{" "}
          <Link href="/account">account page</Link> or directly here, from the
          documentation.
        </p>
        <ApiKey />
      </Section>
    </Section>
  </Page>
);

export default DocumentationPage;
