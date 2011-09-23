import twitter
class TwitterProxy(object):
    
    def __init__(self):
        self.twitter_api = twitter.Twitter(domain="api.twitter.com", api_version=1)
        self.twitter_search = twitter.Twitter(domain="search.twitter.com")
    def getTrends(self):
        trends = self.twitter_api.trends()
        return trends
    def search(self, query, rpp, firstPage, lastPage):
        searchResults = []
        for page in range(firstPage, lastPage):
            res = self.twitter_search.search(q=query, rpp=rpp, page=page)['results']
            if res:
                searchResults.append(res)
        return searchResults

if __name__ == "__main__":
    import json
    tw = TwitterProxy()
    print([trend["name"] for trend in tw.getTrends()["trends"]])
    print("="*10)
    def troySearch():
         
        response = tw.search("Troy Davis OR #troydavis" ,1000, 1, 10)
        with open('troydavisORtroydavisHash.json', mode='w') as f:
            json.dump(response, f)
        response = tw.search("Troy Davis" ,1000, 1, 10)
        with open('troydavis.json', mode='w') as f:
            json.dump(response, f)
        response = tw.search("#troydavis" ,1000, 1, 10)
        with open('troydavisHash.json', mode='w') as f:
            json.dump(response, f)
        response = tw.search("#USA Troy Davis", 1000, 1, 10)
        with open('troydavis_usaHash.json', mode='w') as f:
            json.dump(response, f)
         
        response = tw.search("#USA", 1000, 1, 10)
        with open('usaHash.json', mode='w') as f:
            json.dump(response, f)
     
        response = tw.search("Troy Davis #RIP", 1000, 1,  10)
        with open('troydavis_ripHash.json', mode='w') as f:
            json.dump(response, f) 
        response = tw.search("#RIP", 1000, 1, 10)
        with open('ripHash.json', mode='w') as f:
            json.dump(response, f) 
      
        response = tw.search("Troy Davis #peinedemort", 1000, 1, 10)
        with open('troydavis_peinedemortHash.json', mode='w') as f:
            json.dump(response, f)
    
        response = tw.search("#peinedemort", 1000, 1, 10)
        with open('peinedemortHash.json', mode='w') as f:
            json.dump(response, f)

    def leanSearch(): 
        response = tw.search("Lean Startup OR #leanstartup OR #ericries", 1000, 1, 10)
        with open('leanstartupORleanstartupHashORericriesHash.json', mode='w') as f:
            json.dump(response, f)
    
    def GaddafiSearch(): 
        response = tw.search("al-Gaddafi OR #gaddafi OR #Libya", 1000, 1, 10)
        with open('gaddafiORgaddafiHash.json', mode='w') as f:
            json.dump(response, f)
    def GrouponSearch(): 
        response = tw.search("Groupon OR #groupon ", 1000, 1, 10)
        with open('grouponORgrouponHash.json', mode='w') as f:
            json.dump(response, f)
    #GaddafiSearch()
    #GrouponSearch()
    troySearch()
