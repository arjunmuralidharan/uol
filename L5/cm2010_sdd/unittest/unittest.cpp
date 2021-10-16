#include <cppunit/TestCaller.h>
#include <cppunit/TestCase.h>
#include <cppunit/ui/text/TestRunner.h>

class FixtureTests : public CppUnit::TestFixture {
public:

	void setUp() override {
		printf("Setup is called.\n");
	}

	void tearDown() override {
		printf("Teardown is called.\n");
	}

	void testAddition()
	{
		CPPUNIT_ASSERT(2 + 2 == 3);
		CPPUNIT_ASSERT(2 + 2 == 4);
	}

	void testLogic()
	{
		CPPUNIT_ASSERT(true == false);
	}
};

int main()
{
	CppUnit::TextUi::TestRunner runner {};
	runner.addTest(new CppUnit::TestCaller<FixtureTests> {
		"Test the addition operator", &FixtureTests::testAddition });

	runner.addTest(new CppUnit::TestCaller<FixtureTests> {
		"Test the logic operator", &FixtureTests::testLogic });

	runner.run();
	return 0;
};