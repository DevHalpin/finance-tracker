# Generated by Django 5.2.1 on 2025-06-29 00:28

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_rename_categories_category'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='category',
            options={'verbose_name_plural': 'Categories'},
        ),
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.IntegerField()),
                ('payee', models.CharField(max_length=100)),
                ('notes', models.TextField(blank=True, null=True)),
                ('date', models.DateField()),
                ('account', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.account')),
                ('category', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='api.category')),
            ],
        ),
    ]
