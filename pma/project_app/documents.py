from django_elasticsearch_dsl import Document, fields, Index
from django_elasticsearch_dsl.registries import registry
from .models import Card  # Import the Card model from the appropriate location

@registry.register_document
class CardDocument(Document):
    title = fields.TextField(
        fields={
            'raw': fields.KeywordField(),
            'suggest': fields.CompletionField(),
        }
    )

    desc = fields.TextField(
        fields={
            'raw': fields.KeywordField(),
        }
    )

    class Index:
        name = 'card_index'
        settings = {
            'number_of_shards': 1,
            'number_of_replicas': 0,
        }  

    class Django:
        model = Card  # Link the CardDocument to your Card model
