import { TestPhraseAndFeatureInstances } from './testPhraseAndFeatureInstances';

const peopleTests: TestPhraseAndFeatureInstances[] = [];
peopleTests.push(new TestPhraseAndFeatureInstances('John, Mary may go shopping today.', ['John', 'Mary']));
peopleTests.push(new TestPhraseAndFeatureInstances('Now that you have given me back the money I lent you, we are even Steven', ['Steven']));
peopleTests.push(new TestPhraseAndFeatureInstances('Too bad you couldn\'t have your FBI pal Winston check out a few more names for us.', ['Winston']));
peopleTests.push(new TestPhraseAndFeatureInstances('Their names were Natalie and Matthew, which didn\'t sound much alike.', ['Natalie', 'Matthew']));

const emailTests: TestPhraseAndFeatureInstances[] = [];
emailTests.push(new TestPhraseAndFeatureInstances('Please contact john.doe@example.com or jane.smith@example.com', ['john.doe@example.com', 'jane.smith@example.com']));

const hashtagTests: TestPhraseAndFeatureInstances[] = [];
hashtagTests.push(new TestPhraseAndFeatureInstances('I love #testing and #automation', ['#testing', '#automation']));

const organizationTests: TestPhraseAndFeatureInstances[] = [];
organizationTests.push(new TestPhraseAndFeatureInstances('Facebook is collaborating with Google', ['Facebook', 'Google']));

const phoneNumberTests: TestPhraseAndFeatureInstances[] = [];
phoneNumberTests.push(new TestPhraseAndFeatureInstances('Contact us at 123-456-7890 or 987-654-3210', ['123-456-7890', '987-654-3210']));

const urlTests: TestPhraseAndFeatureInstances[] = [];
urlTests.push(new TestPhraseAndFeatureInstances('Check out https://www.example.com or http://www.test.com', ['https://www.example.com', 'http://www.test.com']));

export { peopleTests, emailTests, hashtagTests, organizationTests, phoneNumberTests, urlTests };