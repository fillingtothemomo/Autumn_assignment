from django_elasticsearch_dsl import Document, fields, Index
from django_elasticsearch_dsl.registries import registry
from .models.CardModel import Card  # Import the Card model from the appropriate location

PUBLISHER_INDEX=Index('card_index')
PUBLISHER_INDEX.settings(
    number_of_shards= 1,
    number_of_replicas= 1
)
@PUBLISHER_INDEX.doc_type

class CardDocument(Document):
   
   title = fields.TextField(
        fields={
            'raw': {
               "type":'keyword'
            }
            
        }
    )
   desc = fields.TextField(
        fields={
            'raw': {
               "type":'keyword'
            }
            
        }
    )
   class Django(object):
      model=Card


  
    


   