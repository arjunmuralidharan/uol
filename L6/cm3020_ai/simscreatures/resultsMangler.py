import pandas as pd

def createPlot(results):

	df = pd.DataFrame.from_records(results, columns=['Iteration','Fittest', 'Mean', 'Mean Links', 'Max Links'])
	df = df.set_index(['Iteration'])
	myplot = df[['Fittest', 'Mean']].plot(kind="line").get_figure()
	myplot.savefig('test.png')